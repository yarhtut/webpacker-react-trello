class ListsController < ApplicationController
  before_action :set_list, only: [:show, :edit, :destroy]
  before_action :set_list_by_position, only: [:update]

  # GET /lists
  # GET /lists.json
  def index
    #lists = Hash[list.each_slice(2).to_a]
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

    respond_to do |format|
      if @list.save
        format.html { redirect_to @list, notice: 'List was successfully created.' }
        format.json { render :show, status: :created, location: @list }
      else
        format.html { render :new }
        format.json { render json: @list.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /lists/1
  # PATCH/PUT /lists/1.json
  def update
      @list_position.update_attributes(position: list_params['position'])
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
