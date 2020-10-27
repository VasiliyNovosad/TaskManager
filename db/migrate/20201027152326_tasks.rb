class Tasks < ActiveRecord::Migration[6.0]
  def up
    create_table :tasks do |t|
      t.string :name
      t.references :project, foreign_key: true
      t.boolean :done, default: false
      t.datetime :deadline
      t.integer :priority
    end
  end

  def down
    drop_table :tasks
  end
end
