class Card < ApplicationRecord
  acts_as_list scope: :list

  belongs_to :list
  has_many :todos, ->{ order(position: :asc) }, dependent: :destroy

  validates :name, presence: true
end
