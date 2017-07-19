import * as moment from 'moment'

import { StringField, AbstractField, NumericField, 
    DateTimeField, NumericArrayField, ChoiceField,
    ModelReferenceField 
} from '../lib/fields'
import { ValidationError } from '../lib/errors'

class TestField extends AbstractField<any> {
    toIntervalValue (value) {
        return value
    }
    toRepresentation (value) {
        return value
    }
}

test ('Test Reduce method', async () => {
    let field = new TestField()
    let validators = [
        (val) => val
    ]
    let result = await field._reduce(10, validators)
    expect(result).toBe(10)
})

test('String', async () => {
    const stringField = new StringField()
    // String
    expect(await stringField.validate('10')).toBe('10')
    // Not string
    await expect(stringField.validate(123)).rejects.toBeDefined()
})

test('String with min length', async () => {
    const stringField = new StringField({
        minLength: 10
    })
    await expect(stringField.validate('abc')).rejects.toBeDefined()
    expect(await stringField.validate('1234567890')).toBe('1234567890')
})

test('String with max length', async () => {
    const stringField = new StringField({
        maxLength: 10
    })
    await expect(stringField.validate('1234567890123')).rejects.toBeDefined()
    expect(await stringField.validate('1234567890')).toBe('1234567890')
})

test('Numeric', async () => {
    const numericField = new NumericField()
    // Number
    expect(await numericField.validate(10)).toBe(10)
    // Not number
    await expect(numericField.validate('1234567890123')).rejects.toBeDefined()
})

test('String with min value', async () => {
    const numericField = new NumericField({
        minValue: 10
    })
    await expect(numericField.validate(9)).rejects.toBeDefined()
    expect(await numericField.validate(10)).toBe(10)
})

test('String with max value', async () => {
    const numericField = new NumericField({
        maxValue: 10
    })
    await expect(numericField.validate(11)).rejects.toBeDefined()
    expect(await numericField.validate(10)).toBe(10)
})

test('Date field', async () => {
    const format = 'YYYY-MM-DD'
    const dateField = new DateTimeField({
        format
    })
    expect(await dateField.validate('2017-04-17'))
        .toEqual(moment('2017-04-17', format).toDate())

    // To representation (string)
    expect(dateField.toRepresentation(new Date('2017-04-17')))
        .toBe('2017-04-17')
})

test('Numeric array', async () => {
    const arrayField = new NumericArrayField()
    await expect(arrayField.validate(['1', '2', '3'])).rejects.toBeDefined()
    expect(await arrayField.validate([1,2,3])).toEqual([1,2,3])
})

test('Choice field string', async () => {
    const choiceField = new ChoiceField({
        choices: ['aku', 'dia']
    })
    await expect(choiceField.validate('bapakmu')).rejects.toBeDefined()
    expect(await choiceField.validate('aku')).toBe('aku')
    expect(await choiceField.validate('dia')).toBe('dia')
})

test('Choice field number', async () => {
    const choiceField = new ChoiceField({
        choices: [1, 2]
    })
    await expect(choiceField.validate(3)).rejects.toBeDefined()
    expect(await choiceField.validate(1)).toBe(1)
    expect(await choiceField.validate(2)).toBe(2)
})

test('Model reference field', async () => {
    const model = {
        primaryKeyField: 'id',
        // Not null
        findOne: async () => ({})
    }
    const field = new ModelReferenceField({
        model
    })
    expect(await field.validate(1)).toBe(1)
    expect(await field.validate('abc')).toBe('abc')
})

test('Model reference field (not exist)', async () => {
    const model = {
        primaryKeyField: 'id',
        // Not null
        findOne: async () => null
    }
    const field = new ModelReferenceField({
        model
    })
    await expect(field.validate(1)).rejects.toBeDefined()
})