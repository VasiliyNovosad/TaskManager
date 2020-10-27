class Projects < ActiveRecord::Migration[6.0]
  def up
    create_table :projects do |t|
      t.string :name
    end
  end

  def down
    drop_table :projects
  end
end
