require 'byebug'
class PlacesController < ApplicationController
  before_action :set_place, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  # GET /places
  # GET /places.json
  def index
    @itinerary = Trip.find(params[:trip_id])
    @places = Place.where(trip_id: params[:trip_id])
    @trip = params[:trip_id]

    @place = Place.new
    @location = params[:location]
    @details = Trip.find(params[:trip_id])

  end

  # GET /places/1
  # GET /places/1.json
  def show
    @trip = Trip.find(params[:trip_id])
    @place = Place.find(params[:id])
  end

  # GET /places/new
  def new
    puts "PARAMS: #{params[:location]}"
    @place = Place.new
    @location = params[:location]
    @trip = params[:trip_id]
    @details = Trip.find(params[:trip_id])

  end

  # GET /places/1/edit
  def edit
    @trip = Trip.find(params[:trip_id])
    @place = Place.find(params[:id])

    @places = Place.where(trip_id: params[:trip_id])
    @others = @places.where.not(id: params[:id])

  end

  # POST /places
  # POST /places.json
  def create
    # params = { place: {location: "foo"} }
    # puts "PARAMS: #{params[:place]}"
    @trip = Trip.find(params[:trip_id])
    @place = Place.new(place_params)

    respond_to do |format|
      if @place.save
        format.html { redirect_to trip_places_path(@trip), notice: 'Place was successfully created.' }
        format.json { render :show, status: :created, location: @place }
      else
        format.html { render :new }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /places/1
  # PATCH/PUT /places/1.json
  def update
    @trip = Trip.find(params[:trip_id])
    @place = Place.find(params[:id])
    respond_to do |format|
      if @place.update(place_params)
        format.html { redirect_to trip_places_path(@trip), notice: 'Place was successfully updated.' }
        format.json { render :show, status: :ok, location: @place }
      else
        format.html { render :edit }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /places/1
  # DELETE /places/1.json
  def destroy
    @place.destroy
    respond_to do |format|
      format.html { redirect_to trip_places_url, notice: 'Place was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_params
      params.require(:place).permit(:title, :content, :date, :location, :trip_id)
    end
end
