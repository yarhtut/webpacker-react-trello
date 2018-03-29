class ListsController < ApplicationController
  before_action :set_list, only: [:show, :edit, :destroy]
  before_action :set_list_by_position, only: [:update]

  # GET /lists
  # GET /lists.json
  def index
    list = List.all.sort_by{ |l| l.position }
    render json:  list.collect { |x| [  x.name,  x.cards ] }.to_h
  end

  # GET /lists/1
  # GET /lists/1.json
  def show
  end

  # GET /lists/new
  def new
    @list = List.new
  end

  # GET /lists/1/edit
  def edit
  end

  # POST /lists
  # POST /lists.json
  def create
    @list = List.new(list_params)
    @list.save
    broadcast
  end

  # PATCH/PUT /lists/1
  # PATCH/PUT /lists/1.json
  def update
    @list_position.update_attributes(position: list_params['position'])
    broadcast
  end

  # DELETE /lists/1
  # DELETE /lists/1.json
  def destroy
    @list.destroy
    respond_to do |format|
      format.html { redirect_to lists_url, notice: 'List was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  def broadcast
    list = List.all.sort_by{ |l| l.position }
    ActionCable.server.broadcast 'list_channel', message: list.collect { |x| [  x.name,  x.cards ] }.to_h.to_json
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_list
    @list = List.find(params[:id])
  end

  def set_list_by_position
    @list_position = List.find_by_position(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def list_params
    params.require(:list).permit(:name, :position)
  end
end
