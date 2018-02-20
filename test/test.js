const expect = require('chai').expect

const mappings = require('./support/mappings')

const BOTMATIC_CONTACT = {
  "account": "candidat",
  "demarches": "{\"id\":\"1959\",\"date_creation\":\"2012-03-14 00:00:00\",\"date_debut\":\"01/04/2012\",\"duree\":\"6\",\"type_id\":\"3\",\"statut\":\"active\"}",
  "email": "arthur@botmatic.ai",
  "firstname": "Botmatic",
  "id": 4015,
  "lastname": "dflghjk",
  "phone": "lfkgjsdf",
  "school": "{\"id\":418,\"nom\":\"Turlu tutu\",\"nom_synonyme1\":\"Tointoin\",\"nom_synonyme2\":\"Ta maman\"}",
  "signup_date": "2018-02-09T12:44:26.000Z",
  "validation": 1
}

const EXTERNAL_CONTACT = {
  "id":                4015,
  "nom":               "dflghjk",
  "prenom":            "Botmatic",
  "email":             "arthur@botmatic.ai",
  "telephone":         "lfkgjsdf",
  "date_inscription":  "2018-02-09 12:44:26",
  "validation":        1,
  "compte":            "candidat",
  "etablissement":     {
    "id":            418,
    "nom":           "Turlu tutu",
    "nom_synonyme1": "Tointoin",
    "nom_synonyme2": "Ta maman",
  },
  "demarches":         {
    "id":                "1959",
    "date_creation":     "2012-03-14 00:00:00",
    "date_debut":        "01/04/2012",
    "duree":             "6",
    "type_id":           "3",
    "statut":            "active"
  }
}

describe("maps data", () => {
  it("should map from botmatic to ajstage", () => {
    const mapper = require('../src/index')(mappings)

    const mapped = mapper.mapTo(BOTMATIC_CONTACT, 'botmatic', 'ext')

    expect(mapped).to.deep.equal(EXTERNAL_CONTACT)
  })

  it("should map from ajstage to botmatic", () => {
    const mapper = require('../src/index')(mappings)

    const mapped = mapper.mapTo(EXTERNAL_CONTACT, 'ext', 'botmatic')

    expect(mapped).to.deep.equal(BOTMATIC_CONTACT)
  })
})

describe("get ext id function", () => {
  it("should create a getExtid function", () => {
    const mapper = require('../src/index')(mappings)

    const extIdKey = mapper.getExtIdKey()

    expect(extIdKey).to.equal('id')
  })
})