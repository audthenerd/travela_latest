Rails.application.routes.draw do
  root 'firstpage#index'
  get 'firstpage/index'

  resources :trips do
    resources :places
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

