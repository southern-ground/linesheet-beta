/**
 * Created by fst on 2/2/17.
 */

/* API */

export const API = "http://shellybrown.com/linesheets/api/";

/* FILES */
export const JSON_FILE = "http://shellybrown.com/linesheets/data/linesheets.json";

/* ERRORS */

export const ERROR_CATEGORY = "invalid category name";
export const ERROR_SKU = "invalid item sku";
export const ERROR_NAME = "invalid item name";

/* ACTIONS */

// Sort for the Inventory Items
export const SORT_SKU = "sort-sku";
export const SORT_NAME = "sort-name";
export const SORT_WHOLESALE = "sort-wholesale";
export const SORT_MSRP = "sort-msrp";

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
export const SAVE_SELECTION = "action_update_save_selection";
export const SELECT_CATEGORY = "action_select_category";
export const SELECT_ITEM = "action_select_item";
export const SELECT_ALL_INVENTORY_ITEMS = "action_get_all_inventory_items";
export const SORT_HOME_INVENTORY_ON = "action_sort_home_inventory";
export const TOGGLE_ADD_ITEM_FORM = "action_inventory_toggle_form";
export const UPDATE_ITEM = "action_update_inventory";
export const UPDATE_ITEM_RESPONSE = "action_update_inventory_response";

/* IMAGES */
export const CLOSE_IMAGE_OVERLAY = "close_image_overlay";
export const GET_IMAGES = "images";
export const GET_IMAGES_RESPONSE = "images_response";
export const ITEM_IMAGE_PATH = "http://shellybrown.com/linesheets/img/products/";
export const OPEN_IMAGE_OVERLAY = "open_image_overlay";

/* SUNDRY */
export const ITEM_IMAGE_THUMBNAIL_PLACEHOLDER = "http://placehold.it/50/ff00ff/000";
export const ITEM_IMAGE_PLACEHOLDER = "http://placehold.it/640/ff00ff/000";

/* INVENTORY ITEMS */
export const SKU_FIELD_REF = "itemSKU";
export const NAME_FIELD_REF = "itemName";
export const IMAGE_SRC_REF = "itemImage";
export const MATERIAL_FIELD_REF = "itemMaterial";
export const SWAROVSKI_FIELD_REF = "itemSwarovski";
export const NAT_FIELD_REF = "itemNatural";
export const CATEGORIES_FIELD_REF = "itemCategories";
export const WHOLESALE_FIELD_REF = "itemWholesale";
export const MSRP_FIELD_REF = "itemMSRP";

export const sanitizeString = (str)=>{
    return str
        .replace(/<[^>]*>/gi, '')
        .replace(/[^\w]/gi, '_');
};

export const sanitizeProductName = (str)=>{
    return str
        .replace(/<[^>]*>/gi, '')
        .replace(/[^\w\s]/gi, '');
};