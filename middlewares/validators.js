import { body } from "express-validator"
import { validateErros } from './validate.errors.js'
import {
    existEmail,
    existUserName,
    comonPasswords, 
    objectIdValid,
    validatePhoneNumberForDB
} from '../utils/db.validators.js'

export const registerUser = [
    body('name')
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ max: 30 }).withMessage(`Can't be more than 30 characters`),
    body('surname')
        .notEmpty().withMessage('Surname cannot be empty')
        .isLength({ max: 30 }).withMessage(`Can't be more than 30 characters`),
    body('username')
        .notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 4, max: 10 }).withMessage(`Username must be between 4 and 10 characters`)
        .custom(existUserName),
     // address.zone: opcional
    body('address.zone')
        .notEmpty().withMessage('La zona no puede estar vacía')
        .isLength({ max: 30 }).withMessage(`La zona no puede tener más de 30 caracteres`)
        .isString().withMessage('La zona debe ser un texto válido'),

    // address.municipality: opcional
    body('address.municipality')
        .notEmpty().withMessage('El municipio no puede estar vacío')
        .isLength({ max: 30 }).withMessage(`El municipio no puede tener más de 30 caracteres`)
        .isString().withMessage('El municipio debe ser un texto válido'),

    // address.department: opcional
    body('address.department')
        .notEmpty().withMessage('El departamento no puede estar vacío')
        .isLength({ max: 30 }).withMessage(`El departamento no puede tener más de 30 caracteres`)
        .isString().withMessage('El departamento debe ser un texto válido'),
    body('mobilePhone')
        .notEmpty().withMessage('Mobile phone cannot be empty')
        .custom((mobilePhone, { req }) => {
            const countryCode = req.body.country; // Asegúrate de que el código de país se envíe en el body
            if (!countryCode) {
                throw new Error('Country code is required for phone number validation.');
            }
            const validationResult = validatePhoneNumberForDB(mobilePhone, countryCode);
            if (!validationResult.isValid) {
                throw new Error(validationResult.error);
            }
            // Si la validación es exitosa, puedes opcionalmente guardar el número normalizado en req.body
            req.body.mobilePhone = validationResult.normalizedNumber;
            return true; // Indica que la validación pasó
        }),
    body('country')
        .notEmpty().withMessage('Country cannot be empty')
        .isLength({ min: 2, max: 2 }).withMessage('Country code must be a 2-letter ISO code (e.g., US, GT)'),
    body('email')
        .notEmpty().withMessage('Email cannot be empty')
        .isEmail().withMessage('Enter a valid Email')
        .custom(existEmail),
    body('password')
        .notEmpty().withMessage('Password cannot be empty')
        .isStrongPassword(
            {
                minLength: 4,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 0,
            }
        )
        .isLength({ min: 4 }).withMessage(`The password must be at least 4 characters long`)
        .custom(comonPasswords),
    validateErros,
]

export const createdReport = [
    body('issueTitle')
        .notEmpty().withMessage('Issue title cannot be empty')
        .isLength({ max: 100 }).withMessage(`Issue title can't be more than 100 characters`),
    body('issueCategory')
        .notEmpty().withMessage('Issue category cannot be empty')
        .isLength({ max: 50 }).withMessage(`Issue category can't be more than 50 characters`),
    body('description')
        .notEmpty().withMessage('Description cannot be empty')
        .isLength({ max: 500 }).withMessage(`Description can't be more than 500 characters`),
    body('urgencyLevel')
        .optional()
        .isIn(['Low', 'Medium', 'High']).withMessage('Urgency level must be Low, Medium, or High'),
    body('reportPhoto')
        .optional(),
    body('solutions')
        .optional()
        .isLength({ max: 500 }).withMessage(`Solutions can't be more than 500 characters`),
    body('community')
        .notEmpty().withMessage('Community cannot be empty')
        .custom(objectIdValid).withMessage('Community must be a valid ObjectId'),
    validateErros,
]

export const updatedReport = [
    body('issueTitle')
        .optional()
        .isLength({ max: 100 }).withMessage(`Issue title can't be more than 100 characters`),
    body('issueCategory')
        .optional()
        .isLength({ max: 50 }).withMessage(`Issue category can't be more than 50 characters`),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage(`Description can't be more than 500 characters`),
    body('urgencyLevel')
        .optional()
        .isIn(['Low', 'Medium', 'High']).withMessage('Urgency level must be Low, Medium, or High'),
    body('reportPhoto')
        .optional(),
    body('solutions')
        .optional()
        .isLength({ max: 500 }).withMessage(`Solutions can't be more than 500 characters`),
    body('community')
        .optional()
        .custom(objectIdValid).withMessage('Community must be a valid ObjectId'),
    validateErros,
]

export const createPayment = [
    body('campaign')
      .notEmpty().withMessage('Campaign is required')
      .custom(objectIdValid).withMessage('Campaign must be a valid ObjectId'),
    body('amount')
      .notEmpty().withMessage('Amount is required')
      .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('paymethod')
      .notEmpty().withMessage('Pay method is required')
      .isIn(['Efectivo', 'Cheque']).withMessage('Pay method must be "Efectivo" or "Cheque"'),
    body('bankcheck')
      .if(body('paymethod').equals('Cheque'))
      .notEmpty().withMessage('Bank check number is required for Cheque payments')
      .isNumeric().withMessage('Bank check must be a number'),
    body('address')
      .notEmpty().withMessage('Address is required')
      .isLength({ max: 100 }).withMessage('Address cannot exceed 100 characters'),
    body('manualDate')
      .optional()
      .isISO8601().withMessage('Manual date must be a valid date'),
    body('status')
      .optional()
      .isIn(['Pendiente', 'Confirmado']).withMessage('Status must be "Pendiente" or "Confirmado"'),
    validateErros
  ]