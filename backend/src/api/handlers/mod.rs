mod auth;
mod health;
mod meal_plans;
mod pantry;
mod profile;
mod recipes;
mod shopping;

pub use auth::{login, logout, me, refresh, register};
pub use health::health;
pub use meal_plans::{create_meal_plan, get_meal_plan, latest_meal_plan, list_meal_plans};
pub use pantry::{create_pantry_item, delete_pantry_item, list_pantry, update_pantry_item};
pub use profile::{get_profile, update_profile};
pub use recipes::{get_recipe, list_recipes};
pub use shopping::{latest_shopping_list, update_shopping_item};
