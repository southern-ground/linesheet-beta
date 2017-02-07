/**
 * Created by fst on 2/2/17.
 */

/* API */

export const API = "http://shellybrown.com/linesheets/api/";
export const API_GATEWAYS = {
    action_get_inventory: "?action=get_inventory",
    action_get_categories: "?action=get_categories",
    action_add_category: "?action=add_category",
    action_delete_category: "?action=delete_category",
    action_delete_item: "?action=delete_item",
    action_edit_category: "?action=edit_category",
    action_add_item: "?action=add_item",
    action_update_inventory: "?action=update_item"
};

/* ERRORS */

export const ERROR_CATEGORY = "invalid category name";
export const ERROR_SKU = "invalid item sku";
export const ERROR_NAME = "invalid item name";

/* ACTIONS */

// Categories:
export const OK = "action_ok";
export const ADD_CATEGORY = "action_add_category";
export const ADD_CATEGORY_RESPONSE = "action_add_category_response";
export const EDIT_CATEGORY = "action_edit_category";
export const GET_CATEGORIES = "action_get_categories";
export const GET_CATEGORIES_RESPONSE = "action_get_categories_response";
export const DELETE_CATEGORY = "action_delete_category";

// Inventory:
export const ADD_ITEM = "action_add_item";
export const ADD_ITEM_RESPONSE = "action_add_item_response";
export const DELETE_ITEM = "action_delete_item";
export const GET_INVENTORY = "action_get_inventory";
export const GET_INVENTORY_RESPONSE = "action_get_inventory_response";
export const UPDATE_ITEM = "action_update_inventory";

/* COOKIES */
export const COOKIE_NAME = "com.shellybrown.linesheets";
export const LOAD_COOKIE = "action_load_cookie";
export const LOAD_COOKIE_RESPONSE = "action_load_cookie_response";