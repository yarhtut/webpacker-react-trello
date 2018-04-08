Rails.application.routes.draw do

  devise_for :users
  resources :homes
  resources :cards
  resources :lists
  resources :todos

  get '/users', to: 'users#index', as: 'users'
  post '/cards/:id', to: 'cards#add_user'
  root to: 'homes#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
