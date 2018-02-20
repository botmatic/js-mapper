const AJDateToISO = (date_string) => {
  return date_string.replace(' ', 'T') + ".000Z"
  // return date.toISOString()
}

const ISOToAJDate = (iso_date) => {
  return iso_date.replace('T', ' ').split('.')[0]
}

module.exports = [
  {
    id: true,
    botmatic: {
      name: "id"
    },
    ext: {
      name: "id",
      transform: (id) => {
        if (typeof id === 'string') {
          return parseInt(id)
        }
        else {
          return id
        }
      }
    }
  },
  {
    botmatic: {
      name: "firstname"
    },
    ext: {
      name: "prenom"
    }
  },
  {
    botmatic: {
      name: "lastname"
    },
    ext: {
      name: "nom"
    }
  },
  {
    botmatic: {
      name: 'email'
    },
    ext: {
      name: 'email'
    }
  },
  {
    botmatic: {
      name: 'phone'
    },
    ext: {
      name: 'telephone'
    }
  },
  {
    botmatic: {
      name: 'signup_date',
      type: 'date',
      transform: AJDateToISO
    },
    ext: {
      name: 'date_inscription',
      transform: ISOToAJDate
    }
  },
  {
    botmatic: {
      name: 'validation',
      type: 'number'
    },
    ext: {
      name: 'validation'
    }
  },
  {
    botmatic: {
      name: 'account'
    },
    ext: {
      name: 'compte'
    }
  },
  {
    botmatic: {
      name: 'origin'
    },
    ext: {
      name: 'provenance'
    }
  },
  {
    botmatic: {
      name: 'school'
    },
    ext: {
      name: 'etablissement'
    }
  },
  {
    botmatic: {
      name: 'demarches'
    },
    ext: {
      name: 'demarches'
    }
  }
]