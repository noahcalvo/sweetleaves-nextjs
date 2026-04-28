# WordPress COA Setup Guide

This guide walks you through setting up the COA (Certificates of Analysis) data in WordPress so the Sweetleaves website can display lab results for gummy products.

You will do this once. After setup, adding new batches is just filling out a form.

---

## Part 1 — Install the Required Plugins

The site already has **WPGraphQL** installed. You need three more plugins.

### 1. Install Custom Post Type UI

1. In WP Admin, go to **Plugins → Add New Plugin**.
2. Search for **Custom Post Type UI**.
3. Find the one by **WebDevStudios** and click **Install Now**.
4. Click **Activate**.

### 2. Install Advanced Custom Fields

1. Still on **Plugins → Add New Plugin**.
2. Search for **Advanced Custom Fields**.
3. Find the one by **WP Engine** and click **Install Now**.
4. Click **Activate**.

### 3. Install WPGraphQL for ACF

1. Still on **Plugins → Add New Plugin**.
2. Search for **WPGraphQL for ACF**.
3. Find the one by **WPGraphQL** and click **Install Now**.
4. Click **Activate**.

---

## Part 2 — Register the COA Batch Post Type

1. In the left sidebar, go to **CPT UI → Add/Edit Post Types**.
2. Fill in the following fields at the top:

   | Field | Value |
   |-------|-------|
   | Post Type Slug | **`coa_batch`** |
   | Plural Label | **`COA Batches`** |
   | Singular Label | **`COA Batch`** |

3. Scroll down to the **Settings** section.
4. Find **Show in GraphQL** and set it to **True**.
5. Set **GraphQL Single Name** to **`coaBatch`**.
6. Set **GraphQL Plural Name** to **`coaBatches`**.

> **Important:** The GraphQL names must be entered exactly as shown — the website uses these to pull the data. A typo here means the COA page will show nothing.

7. Scroll to the bottom and click **Add Post Type**.

You should now see **COA Batches** in the left sidebar.

---

## Part 3 — Create the ACF Field Group

1. In the left sidebar, go to **ACF → Field Groups**.
2. Click **Add New**.
3. At the top, name the field group: **`COA Batch Fields`**

### Add the three fields

**Field 1 — Flavor**

1. Click **Add Field**.
2. Set **Field Label** to **`Flavor`**.
3. The **Field Name** should auto-fill as **`flavor`** — confirm it reads exactly **`flavor`**.
4. Set **Field Type** to **Text**.
5. Click **Add Field** again to add the next one.

**Field 2 — Batch Number**

1. Set **Field Label** to **`Batch Number`**.
2. The **Field Name** should auto-fill as **`batch_number`** — confirm it reads exactly **`batch_number`**.
3. Set **Field Type** to **Text**.
4. Click **Add Field** again.

**Field 3 — PDF URL**

1. Set **Field Label** to **`PDF URL`**.
2. The **Field Name** should auto-fill as **`pdf_url`** — confirm it reads exactly **`pdf_url`**.
3. Set **Field Type** to **URL**.

### Set the location rule

Scroll down to the **Location** section.

1. You should see a rule that says **Post Type** / **is equal to** / *(a dropdown)*.
2. Set the dropdown to **`coa_batch`**.

### Enable GraphQL on the field group

Scroll down to the **Settings** section.

1. Find **Show in GraphQL** and set it to **True**.
2. Set **GraphQL Field Name** to **`coaBatchFields`**.

> **Important:** This must be **`coaBatchFields`** exactly. The website looks for this name to read the flavor, batch number, and PDF link.

3. Click **Publish** (top right or bottom of page).

---

## Part 4 — Add the First Test Entry

1. In the left sidebar, go to **COA Batches → Add New COA Batch**.
2. Set the **Title** (post title at the top) to: **`Pink Lemonade — Apr 2026`**

   > The title is just a label for you to find this entry in the admin. It does not appear on the website.

3. Scroll down to the **COA Batch Fields** section and fill in:

   | Field | Value |
   |-------|-------|
   | Flavor | **`Pink Lemonade`** |
   | Batch Number | **`B-26041-PLE`** |
   | PDF URL | *(leave blank for now)* |

   > **Note:** The Flavor field must be one of the approved flavors: Pink Lemonade, Blackberry, Passion Fruit, Pineapple, Tropical Mix, or Peach. Spelling and capitalization do not need to be exact, but the name must match one of these.

4. Click **Publish**.

---

## Part 5 — Verify the Setup

Run a quick test to confirm everything is connected correctly.

1. In the left sidebar, go to **GraphQL → GraphiQL IDE**.
2. Paste the following query into the editor:

   ```graphql
   query {
     coaBatches(first: 5) {
       nodes {
         title
         coaBatchFields {
           flavor
           batchNumber
           pdfUrl
         }
       }
     }
   }
   ```

3. Click the **Run** button (the play/triangle icon).
4. Look at the result panel on the right.

**What a successful result looks like:**

```json
{
  "data": {
    "coaBatches": {
      "nodes": [
        {
          "title": "Pink Lemonade — Apr 2026",
          "coaBatchFields": {
            "flavor": "Pink Lemonade",
            "batchNumber": "B-26041-PLE",
            "pdfUrl": null
          }
        }
      ]
    }
  }
}
```

If you see `"nodes": []` (empty array), that means the query worked but the entry was not found — double-check that the post was Published (not Draft).

If you see an error instead of `"data"`, something in Part 2 or Part 3 was not set up correctly. Check that the GraphQL names match exactly and that the field group location is set to `coa_batch`.

---

## Setup Checklist

Use this to confirm everything is done before notifying the dev team.

- [ ] Custom Post Type UI installed and active
- [ ] Advanced Custom Fields installed and active
- [ ] WPGraphQL for ACF installed and active
- [ ] CPT slug is `coa_batch`, GraphQL single name is `coaBatch`, plural is `coaBatches`
- [ ] ACF field group named `COA Batch Fields` with location set to `coa_batch`
- [ ] Field names are exactly: `flavor`, `batch_number`, `pdf_url`
- [ ] Field group GraphQL field name is `coaBatchFields` with Show in GraphQL = True
- [ ] First test entry published with Flavor = `Pink Lemonade`, Batch Number = `B-26041-PLE`
- [ ] GraphiQL query returns the test entry without errors
