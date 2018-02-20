# JS Mapper

A mapping module for botmatic integrations.
Maps properties from Botmatic to your own format, back and forth.

## Basic usage

parameter | type  | description
--------- | ----- | ---
mappings  | array | An array of mappings. See the *Configure Mappings* section below

```javascript
// Initialisation
const mapper = require('js-mapper')(mappings)
```


## Basic example

Let's say you want to create an integration with an external service and want
to synchronise its `candidates` table with Botmatic's Contacts

### From an external API to Botmatic

Your API returns candidates as JSON objects as follow: 
```json
{
  "id_candidate": 98,
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "john.doe@does.com",
  "birth_date": "1985-04-29"
}
```

`@botmatic/js-mapper` converts it to a Botmatic compliant format on the fly:
```javascript
const botmaticContact = mapper.mapTo(candidate, 'ext', 'botmatic')
```
`botmaticContact` now contains a Botmatic Contact:
```json
{
  "id": 98,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@does.com",
  "birthdate": "1985-04-29T00:00:00.000Z"
}
```

### From an Botmatic to an external API

Botmatic returns contacts as JSON objects as follow: 
```json
{
  "id": 98,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@does.com",
  "birthdate": "1985-04-29T00:00:00.000Z"
}
```

`@botmatic/js-mapper` converts it to a format expected by your API:
```javascript
const botmaticContact = mapper.mapTo(candidate, 'botmatic', 'ext')
```
`externalCandidate` now contains a candidate:
```json
{
  "id_candidate": 98,
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "john.doe@does.com",
  "birth_date": "1985-04-29"
}
```

## Configure Mappings
The `mappings` object you pass on initialisation is an array of `Mapping` objects.
There is `Mapping` object for each field you want to synchronize between Botmatic
and your application.

### The Mapping object

property | type    | description
-------- | ------- | -----------
botmatic | object  | describes the field in Botmatic Contact
ext      | object  | descrives the field in your application
id       | boolean | [optional] `true` if this is the identifying field (primary key)

#### Field description object

| key        | type     | possible values            | description
| ---------- | -------- | -------------------------- | ----------------------------
| name       | string   | *any*                      | field name 
| type       | string   | text, date, number         | (optional, default="text") only for botmatic
| transform  | function | function(string) -> string | (optional) value transformer

#### Examples
```javascript
// A sample of a config
// It will 
 
const config = [
  {
    // field description on Botmatic
    botmatic: { name: 'firstname' },
    // field description on your integration
    ext: { name: 'first_name' },
  },
  // ...
]
```

##### Id fields
To map the id field add the property `id` to the mapping, and set it to `true`
```javascript
// A sample of a config
 
const config = [
  {
    // This is an id field
    id: true,
    // field description on Botmatic
    botmatic: { name: 'id' },
    // field description on your integration
    your_integration: { name: 'id_andidate' },
  },
  // ...
]
```

##### Dates
Botmatic uses ISO 8601 Date notation. If your application uses an other format, you should use specific transform functions

For example, if you API uses timestamps for dates, you can declare these transform functions alongside your mappings:
```javascript
// From timestamp to ISO
const timestampToISO = (timestamp) => {
  return (new Date(timestamp)).toISOString()
}

// From ISO to timestamp
const ISOToTimestamp = (iso) => {
  return +(new Date(iso))
}
```
And the mapping object for the date field:
```javascript
const mappings = [
  ...
  {
    botmatic: {
      name: "birthdate",
      type: "date",
      transform: timestampToISO
    },
    ext: {
      name: "date_of_birth",
      transform: ISOToTimestamp
    }
  }
]
```


## Map contact properties
From botmatic to your integration
```javascript
const mappedContact = mapper.mapTo(contact, 'botmatic', 'ext')
```

From your integration to Botmatic
```javascript
const mappedContact = mapper.mapTo(contact, 'ext', 'botmatic')
```

## Obtaining the id key
The identifying key on Botmatic's Contacts is always `id`.
You must always have a mapping for the `id` key in your mappings.  
To get the name of the identifying key on your external schema:
```javascript
const extIdKey = mapper.getExtIdKey()
// extIdKey == "id_candidate"
```

## Access your mappings at runtime
If for any reason you need to access your mappings at runtime
```javascript
const mappings = mapper.data
```