// =============================================================================
// PETUTION SERVER-SIDE VALIDATION & SANITIZATION MIDDLEWARE
// Production Payload Validation for REST API Endpoints using express-validator
// =============================================================================

import { body, validationResult } from 'express-validator';

/**
 * Handle Validation Errors Middleware
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Invalid request payload provided.',
      details: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// 1. Auth Validation Rules
export const validateAuthLogin = [
  body('email').isEmail().withMessage('Must provide a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.').isLength({ min: 4 }).withMessage('Password must be at least 4 characters.'),
  handleValidationErrors
];

export const validateAuthSignup = [
  body('name').trim().notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('Must provide a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('clinicName').optional().trim(),
  handleValidationErrors
];

// 2. Client Validation Rules
export const validateClientPayload = [
  body('name').trim().notEmpty().withMessage('Client name is required.'),
  body('phone').trim().notEmpty().withMessage('Contact phone number is required.'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Must be a valid email.').normalizeEmail(),
  body('tags').optional().isArray().withMessage('Tags must be an array.'),
  handleValidationErrors
];

// 3. Pet Patient Validation Rules
export const validatePetPayload = [
  body('name').trim().notEmpty().withMessage('Pet name is required.'),
  body('species').trim().toLowerCase().isIn(['cat', 'dog', 'turtle', 'bird', 'rabbit', 'hamster', 'other']).withMessage('Species must be cat, dog, turtle, bird, rabbit, hamster, or other.'),
  body('gender').optional().trim().toLowerCase().isIn(['male', 'female', 'unknown']).withMessage('Gender must be male, female, or unknown.'),
  body('ageValue').optional().isFloat({ min: 0 }).withMessage('Age value must be a non-negative number.'),
  body('ageUnit').optional().trim().isIn(['months', 'years', 'days']).withMessage('Age unit must be days, months, or years.'),
  body('microchipNumber').optional().trim(),
  body('castrated').optional().isBoolean().withMessage('Castrated status must be a boolean.'),
  body('vaccinated').optional().isBoolean().withMessage('Vaccinated status must be a boolean.'),
  handleValidationErrors
];

// 4. Visit Appointment Validation Rules
export const validateVisitPayload = [
  body('petId').notEmpty().withMessage('petId is required.'),
  body('doctorName').trim().notEmpty().withMessage('Doctor name is required.'),
  body('visitType').trim().notEmpty().withMessage('Visit type is required.'),
  body('date').notEmpty().withMessage('Visit date is required.'),
  body('state').optional().isIn(['scheduled', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid visit state.'),
  handleValidationErrors
];

// 5. SOAP Clinical Note Validation Rules
export const validateSOAPNotePayload = [
  body('visitId').notEmpty().withMessage('visitId is required.'),
  body('petId').notEmpty().withMessage('petId is required.'),
  body('vetName').trim().notEmpty().withMessage('Veterinarian name is required.'),
  body('tempC').optional({ checkFalsy: true }).isFloat({ min: 30, max: 45 }).withMessage('Body temperature must be between 30°C and 45°C.'),
  body('weightKg').optional({ checkFalsy: true }).isFloat({ min: 0.1, max: 500 }).withMessage('Weight must be between 0.1 kg and 500 kg.'),
  body('rxMedications').optional().isArray().withMessage('Prescribed medications must be an array.'),
  handleValidationErrors
];

// 6. Product & Inventory Validation Rules
export const validateProductPayload = [
  body('name').trim().notEmpty().withMessage('Product name is required.'),
  body('category').optional().isIn(['product', 'service']).withMessage('Category must be product or service.'),
  body('pricePerUnit').isFloat({ min: 0 }).withMessage('Price per unit must be a non-negative number.'),
  body('costPerUnit').optional().isFloat({ min: 0 }).withMessage('Cost per unit must be a non-negative number.'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
  handleValidationErrors
];

// 7. Billing & Invoice Validation Rules
export const validateInvoicePayload = [
  body('invoiceNumber').trim().notEmpty().withMessage('Invoice number is required.'),
  body('items').isArray({ min: 1 }).withMessage('Invoice must contain at least one item.'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a non-negative number.'),
  body('total').isFloat({ min: 0 }).withMessage('Total amount must be a non-negative number.'),
  body('status').optional().isIn(['paid', 'pending', 'unpaid']).withMessage('Invalid payment status.'),
  handleValidationErrors
];

// 8. Expense Validation Rules
export const validateExpensePayload = [
  body('title').trim().notEmpty().withMessage('Expense title is required.'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Expense amount must be greater than zero.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  handleValidationErrors
];
