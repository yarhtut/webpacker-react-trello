class CreateCards < ActiveRecord::Migration[5.1]
  def change
    create_table :cards do |t|
      t.references :list, foreign_key: true
      t.string  :name
      t.string  :description
      t.integer :position
      t.string  :user_name

      t.timestamps
    end
  end
end
