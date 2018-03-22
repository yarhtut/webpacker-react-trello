class TodosController < ApplicationController
  before_action :set_todo, only: [:show, :edit, :destroy]
  #before_action :set_todo_by_position, only: [:update]


  # GET /todos
  # GET /todos.json
  def index
    @todos = Todo.all
  end

  # GET /todos/1
  # GET /todos/1.json
  def show
    todo = Todo.find_by_id(params[:id])
    render json:  todo.todos
  end

  # GET /todos/new
  def new
    @todo = Todo.new
  end

  # GET /todos/1/edit
  def edit
  end

  # POST /todos
  # POST /todos.json
  def create
    @todo = Todo.new(todo_params)
    @todo.save
  end

  # PATCH/PUT /todos/1
  # PATCH/PUT /todos/1.json
  def update
    @todo_position.update_attributes(position: todo_params['position'])
  end

  # DELETE /todos/1
  # DELETE /todos/1.json
  def destroy
    new_name = @todo.name
    new_position = params[:destination][:index] + 1
    new_card_id = Card.find_by(name: params[:destination][:droppableId]).id
    @todo.destroy
    @new_todo = Todo.new(card_id: new_card_id, name: new_name,  position: new_position)
    @new_todo.save
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_todo
    @todo = Todo.find(params[:id])
  end

  def set_todo_by_position
    @todo_position = Todo.find_by(id: params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white card through.
  def todo_params
    params.require(:todo).permit(:card_id, :text, :checked)
  end
end
