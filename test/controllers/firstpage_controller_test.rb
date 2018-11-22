require 'test_helper'

class FirstpageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get firstpage_index_url
    assert_response :success
  end

end
