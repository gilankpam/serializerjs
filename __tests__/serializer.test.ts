import * as moment from 'moment'

import { AbstractSerializer, field } from '../lib/serializer'
import {
    StringField,
    NumericField,
    DateTimeField
} from '../lib/fields'
import { ValidationError } from '../lib/errors'

async function serializerTest(SerializerClass) {
    const origData = {
        name: 'Gilang Pambudi',
        age: 17,
        birth_date: '1993-04-17'
    }
    
    try {
        await (new SerializerClass({
            data: {
                ...origData,
                age: 0
            }
        })).validate()
        throw new Error('fail')
    } catch (err) {
        expect(err.fields).toEqual({
            age: 'Min value 1'
        })
    }

    try {
        await (new SerializerClass({
            data: {
                ...origData,
                age: 101
            }
        })).validate()
        throw new Error('fail')
    } catch (err) {
        expect(err.fields).toEqual({
            age: 'Max value 100'
        })
    }

    try {
        await (new SerializerClass({
            data: {
                ...origData,
                name: 'Nama panjang banget sekali huehuehuehuehueh'
            }
        })).validate()
        throw new Error('fail')
    } catch (err) {
        expect(err.fields).toEqual({
            name: 'Max length 15'
        })
    }

    try {
        await (new SerializerClass({
            data: {
                ...origData,
                name: 'ohno'
            }
        })).validate()
        throw new Error('fail')
    } catch (err) {
        expect(err.fields).toEqual({
            name: 'Min length 5'
        })
    }

    try {
        await (new SerializerClass({
            data: {
                ...origData,
                birth_date: 'ohno'
            }
        })).validate()
        throw new Error('fail')
    } catch (err) {
        expect(err.fields).toEqual({
            birth_date: "Invalid date format"
        })
    }
}

async function validatedData (SerializerClass) {
    const s = new SerializerClass({
        data: {
            name: '  Gilang Pambudi  ',
            age: 17,
            birth_date: '1993-04-17'
        }
    })
    expect(
        await s.validate()
    ).toEqual({
        name: 'Gilang Pambudi',
        age: 17,
        birth_date: moment('1993-04-17', 'YYYY-MM-DD').toDate()
    })
    expect(s.name).toEqual('Gilang Pambudi')
    expect(s.age).toBe(17)
    expect(s.birth_date).toEqual(moment('1993-04-17', 'YYYY-MM-DD').toDate())
}

test('Serializer Class', () => {
    class MySerializer extends AbstractSerializer {
        protected fields = {
            name: new StringField({
                minLength: 5,
                maxLength: 15
            }),
            age: new NumericField({
                minValue: 1,
                maxValue: 100
            }),
            birth_date: new DateTimeField({
                format: 'YYYY-MM-DD'
            })
        }
        async performSave (validatedData) {
            return validatedData
        }
        async performUpdate (instnace, validatedData) {
            return validatedData
        }
    }

    serializerTest(MySerializer)
    validatedData(MySerializer)
})

test('Serializer class with decorator', async () => {
    class MySerializer extends AbstractSerializer {
        @field(new StringField({
            minLength: 5,
            maxLength: 15
        }))
        public name: string

        @field(new NumericField({
            minValue: 1,
            maxValue: 100
        }))
        public age: number

        @field(new DateTimeField({
            format: 'YYYY-MM-DD'
        }))
        public birth_date: Date

        async performSave (validatedData) {
            return validatedData
        }
        async performUpdate (instnace, validatedData) {
            return validatedData
        }
    }

    serializerTest(MySerializer)
    validatedData(MySerializer)
})