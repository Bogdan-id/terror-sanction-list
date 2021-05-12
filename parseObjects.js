let genCallbacks = {
  keepFields(obj, fields) {
    for (let i of Object.keys(obj)) {
      fields.includes(i) ? false : delete obj[i]
    }
  }
}

module.exports = {
  UNOsancPerson: {
    endElement: 'INDIVIDUAL',
    collectItems: ['INDIVIDUAL_ALIAS'],
    callbacks: [
      obj => {
        obj.fullName = (
          ((obj.SECOND_NAME || '') + ' ') + 
          ((obj.FIRST_NAME || '') + (obj.THIRD_NAME ? ' ' : '')) + 
          ((obj.THIRD_NAME || ''))).toUpperCase()
        obj.firstName = obj.FIRST_NAME || null,
        obj.lastName = obj.SECOND_NAME || null,
        obj.patronymic = obj.THIRD_NAME || null,
        obj.comment = obj.COMMENTS1 || null,
        obj.dateOfBirth = obj.INDIVIDUAL_DATE_OF_BIRTH
          && obj.INDIVIDUAL_DATE_OF_BIRTH.DATE
            ? obj.INDIVIDUAL_DATE_OF_BIRTH.DATE 
            : null,
        obj.nationality = obj.NATIONALITY && obj.NATIONALITY.VALUE 
          ? obj.NATIONALITY.VALUE 
          : null,
        obj.designation = obj.DESIGNATION && obj.DESIGNATION.VALUE 
          ? obj.DESIGNATION.VALUE 
          : null
        
        return obj
      },

      obj => {
        if(!obj.INDIVIDUAL_ALIAS) return obj

        obj.INDIVIDUAL_ALIAS = obj.INDIVIDUAL_ALIAS
          .filter(v => v.ALIAS_NAME && v.ALIAS_NAME !== "")
          .map(v => {
            delete v.QUALITY
            v.ALIAS_NAME = v.ALIAS_NAME.toUpperCase()
            return v
          })

        return obj 
      },

      obj => {
        genCallbacks.keepFields(obj, [
          'fullName',
          'firstName',
          'lastName',
          'patronymic',
          'firstNameUkr',
          'lastNameUrk',
          'patronymicUrk',
          'comment',
          'dateOfBirth',
          'nationality',
          'comments',
          'designation',
          'INDIVIDUAL_ALIAS'
        ])
        return obj
      },
    ]
  },

  UNOsancLegal: {
    endElement: 'ENTITY',
    collectItems: ['ENTITY_ALIAS', 'ENTITY_ADDRESS'],
    callbacks: [
      obj => {
        obj.firstName = obj.FIRST_NAME.toUpperCase() || null,
        obj.unListType = obj.UN_LIST_TYPE || null,
        obj.listedOn = obj.LISTED_ON || null,
        obj.comment = obj.COMMENTS1 || null

        return obj
      },

      obj => {
        genCallbacks.keepFields(obj, [
          'firstName',
          'unListType',
          'listedOn',
          'comment',
          'entityAdress',
          'ENTITY_ALIAS',
          'ENTITY_ADDRESS'
        ])
        return obj
      },

      obj => {
        if(!obj.ENTITY_ALIAS) return obj

        obj.ENTITY_ALIAS = obj.ENTITY_ALIAS
          .filter(v => v.ALIAS_NAME && v.ALIAS_NAME !== "")
          .map(v => {
            delete v.QUALITY
            v.ALIAS_NAME = v.ALIAS_NAME.toUpperCase()
            return v
          })

        return obj 
      },
      obj => {
        obj.ENTITY_ADDRESS = obj.ENTITY_ADDRESS 
          ? obj.ENTITY_ADDRESS.filter(obj => obj && obj !== '') 
          : []
        return obj
      }
    ]
  },

  CanadaPersons: {
    endElement: 'record',
    callbacks: [
      obj => {
        return obj.Entity ? null : obj
      }
    ]
  },
  CanadaLegals: {
    endElement: 'record',
    callbacks: [
      obj => {
        return obj.Entity ? obj : null
      }
    ]
  },

  UNOterrors: {
    endElement: 'acount-list',
    collectItems: ['aka-list'],
    callbacks: [
      obj => {
        genCallbacks.keepFields(obj, [
          'program-entry',
          'aka-list',
          'date-of-birth-list',
          'place-of-birth-list',
          'nationality-list',
          'address-list',
          'comments',
          'type-entry'
        ])
        return obj
      },

      obj => {
        for(let i of Object.keys(obj['aka-list'])) {
          for(let [index, property] of Object.keys(obj['aka-list'][i]).entries()) {
            if(property === 'aka-name' + ++index) continue
            else delete obj['aka-list'][i][property]
          }
        }
      },

      obj => {
        let list = obj['aka-list']

        obj.fullName = Object.values(list[0]).join(' ').toUpperCase()
        obj['aka-list'].shift()
        obj['alsoKnown'] = list.map(v => Object.values(v).join(' ').toUpperCase())

        // delete obj['aka-list']
        return obj
      },
    ]
  },

  USAsanc: {
    endElement: 'sdnEntry',
    collectItems: ['aka', 'address', 'dateOfBirthItem', 'placeOfBirthItem'],
    callbacks: [
      obj => {
        obj.lastName = obj.lastName ? obj.lastName.toUpperCase().trim() : null,
        obj.sdnType = obj.sdnType ? obj.sdnType.toUpperCase().trim() : null,
        obj.title = obj.title ? obj.title.trim() : null

        return obj
      },

      obj => {
        genCallbacks.keepFields(obj, [
          'firstName',
          'lastName',
          'sdnType',
          'title',
          'dateOfBirthList',
          'placeOfBirthList',
          'akaList',
          'addressList',
        ])
        return obj
      },

      obj => {
        let initials = ['lastName', 'firstName']
        
        function filterObj(obj, arrProps, cb) {
          for(let k in obj) {
            if(!arrProps.includes(k)) delete obj[k]
          }

          if(typeof cb === "function") cb(obj)
          
          return obj
        }

        function akaInittials(obj) {
          const lastName = `${obj.lastName ? obj.lastName: ''}`
          const firstName = `${obj.firstName ? ' ' + obj.firstName : ''}`
          const patronymic = `${obj.patronymic || obj.thirdName ? ' ' +  obj.patronymic || ' ' + obj.thirdName : ''}`

          // delete obj.lastName
          // delete obj.firstName

          return obj.fullName = `${lastName}${firstName}${patronymic}`.toUpperCase()
        }

        obj.akaList && obj.akaList.aka 
          ? obj.akaList = obj.akaList.aka.map(v => filterObj(v, initials, akaInittials))
          : false
        obj.addressList && obj.addressList.address 
          ? obj.addressList = obj.addressList.address 
          : false
        if(obj.sdnType.toUpperCase() === 'INDIVIDUAL') {
          obj.firstName ? obj.firstName = obj.firstName.toUpperCase().trim() : false,
          obj.dateOfBirthList && obj.dateOfBirthList.dateOfBirthItem 
            ? obj.dateOfBirthList = obj.dateOfBirthList.dateOfBirthItem 
            : false
          obj.placeOfBirthList && obj.placeOfBirthList.placeOfBirthItem 
            ? obj.placeOfBirthList = obj.placeOfBirthList.placeOfBirthItem 
            : false
          obj.fullName = obj.firstName && obj.lastName 
            ? `${obj.firstName} ${obj.lastName}` 
            : obj.firstName ? obj.firstName : null
        } else if(obj.sdnType.toUpperCase() === 'VESSEL') {
          obj.vesselInfo ? obj.vesselInfo : false
          obj.remarks ? obj.remarks : false
        }
        return obj
      }
    ]
  }
}