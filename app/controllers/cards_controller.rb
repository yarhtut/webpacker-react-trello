class CardsController < ApplicationController
  before_action :set_card, only: [ :edit, :destroy]
  before_action :set_card_by_position, only: [:update]

  # GET /cards
  # GET /cards.json
  def index
    @cards = Card.all
  end

  # GET /cards/1
  # GET /cards/1.json
  def show
    card = Card.find_by_id(params[:id])
    render json:  card.todos
  end

  # GET /cards/new
  def new
    @card = Card.new
  end

  # GET /cards/1/edit
  def edit
  end

  # POST /cards
  # POST /cards.json
  def create
     list_id = List.find_by_position(card_params['list_id']).id
     @card = Card.new(list_id: list_id, name: card_params['name'])
     @card.save
     broadcast if @card.save
    
  end

  # PATCH/PUT /cards/1
  # PATCH/PUT /cards/1.json
  def update
    @card_position.update_attributes(position: card_params['position'])
    broadcast
  end

  # DELETE /cards/1
  # DELETE /cards/1.json
  def destroy
    #new_name = @card.name
    new_position = params[:destination][:index] + 1
    #new_list_id = List.find_by_name(params[:destinationColumnId]).id
    @card.update_attributes(list_id: params[:destinationColumnId], position: new_position)

    #@card.destroy
    #@new_card = Card.new(list_id: new_list_id, name: new_name,  position: new_position)
    #@new_card.save
    broadcast
  end

  private
  def broadcast
    list = List.all.sort_by{ |l| l.position }
    ActionCable.server.broadcast 'list_channel', message: list.collect { |x| [ x.position, [  x.name,  x.cards ]] }.to_h.to_json
  end
  # Use callbacks to share common setup or constraints between actions.
  def set_card
    @card = Card.find(params[:id])
  end

  def set_card_by_position
    @card_position = Card.find_by(id: params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def card_params
    params.require(:card).permit(:list_id, :name, :position, :destination, :destinationColumnName, :listId, :cardId)
  end
end
