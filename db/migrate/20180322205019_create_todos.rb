class CreateTodos < ActiveRecord::Migration[5.1]
  def change
    create_table :todos do |t|
      t.string :text
      t.boolean :checked
      t.references :card, foreign_key: true

      t.timestamps
    end
  end
end
