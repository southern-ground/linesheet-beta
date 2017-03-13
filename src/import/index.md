---
title: Import Items
---
# Import Items

This is a prototype importer to allow for the uploading and parsing of specifically formatted Excel files. 

**Requirements:**
 * The spreadsheet must be in XLXS format
 * The file can only contain a single sheet
 * The sheet must contain a header row (i.e. only items on line 2+ are imported)
 * The columns for the sheet are expected to be:
    * sku
    * category
    * name
    * material
    * swarovski stones
    * natural stones
    * wholesale
    * msrp
* Fields can be blank/empty.
* Items are unique based upon SKU. Any item being imported that is already in the sytem will be automatically skipped