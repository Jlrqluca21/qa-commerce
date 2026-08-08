import { fakerPT_BR as faker } from '@faker-js/faker';

function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

export function buildCheckoutData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    shipping: {
      firstName,
      lastName,
      address: faker.location.streetAddress(),
      number: faker.number.int({ min: 1, max: 9999 }).toString(),
      cep: onlyDigits(faker.location.zipCode('########')).slice(0, 8),
      phone: onlyDigits(faker.phone.number('###########')).slice(0, 11),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    },
    payment: {
      cardNumber: '4111111111111111',
      expiry: '12/30',
      cvc: faker.finance.creditCardCVV(),
    },
  };
}