class AddTripIdToPlaces < ActiveRecord::Migration[5.2]
  def change
    add_reference :places, :trip, index: true
    add_foreign_key :places, :trips
  end
end
