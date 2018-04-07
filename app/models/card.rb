class Card < ApplicationRecord
  acts_as_list scope: :list

  belongs_to :list

  validates :name, presence: true

  has_many :todos, dependent: :destroy

  has_and_belongs_to_many :users
end
