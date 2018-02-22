class CreateCards < ActiveRecord::Migration[5.1]
  def change
    create_table :cards do |t|
      t.string :name
      t.references :list, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
