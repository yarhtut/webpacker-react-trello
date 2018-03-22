class CardsController < ApplicationController
  before_action :set_card, only: [:show, :edit, :destroy]
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
     @card = Card.new(card_params)
     broadcast
    
    respond_to do |format|
      if @card.save
        format.html { redirect_to @card, notice: 'Card was successfully created.' }
        format.json { render :show, status: :created, location: @card }
      else
        format.html { render :new }
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cards/1
  # PATCH/PUT /cards/1.json
  def update
    @card_position.update_attributes(position: card_params['position'])
  end

  # DELETE /cards/1
  # DELETE /cards/1.json
  def destroy
    new_name = @card.name
    new_position = params[:destination][:index] + 1
    new_list_id = List.find_by(name: params[:destination][:droppableId]).id
    @card.destroy
    @new_card = Card.new(list_id: new_list_id, name: new_name,  position: new_position)
    @new_card.save
  end

  private
  def broadcast
    list = List.all.sort_by{ |l| l.position }
    ActionCable.server.broadcast 'list_channel', message: list.collect { |x| [  x.name,  x.cards ] }.to_json
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
    params.require(:card).permit(:list_id, :name, :position)
  end
end
