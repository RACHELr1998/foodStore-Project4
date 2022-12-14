import auth from "../2-utils/auth";
import hash from "../2-utils/cyber";
import { UnauthorizeError, ValidationError } from "../4-models/client-errors";
import { ICredentialsModel } from "../4-models/credentials-model";
import { CustomerModel, ICustomerModel } from "../4-models/customer-model";

async function register(customer: ICustomerModel): Promise<string> {
  // Returning a new token

  // Validate:
  const error = customer.validateSync();
  if (error) throw new ValidationError(error.message);

  //Check if username is already existing:
  const usernameExists = await CustomerModel.findOne({
    username: customer.username,
  }).exec();
  if (usernameExists)
    throw new ValidationError(`Username ${customer.username} is already taken. 
    Please make sure that you are not registered already or please choose a different Username`);

  // hash password
  customer.password = hash(customer.password);
  // hash ID
  customer.IDCustomer = hash(customer.IDCustomer);

  // insert the new customer to the DB
  await customer.save();

  // Delete customer password and ID before return:
  delete customer.password;
  delete customer.IDCustomer;

  // Generate new token:
  const token = auth.generateNewToken(customer);

  return token;
}

async function login(credentials: ICredentialsModel): Promise<string> {
  // Validate:
  const error = credentials.validateSync();
  if (error) throw new ValidationError(error.message);

  // hash password
  credentials.password = hash(credentials.password);

  // Get the customer by his credentials
  const customer = await CustomerModel.findOne({
    username: credentials.username,
    password: credentials.password,
  }).exec();

  // If no such customer exists:
  if (!customer) throw new UnauthorizeError("Incorrect username or password!");

  // Delete customer password before return:
  delete customer.password;

  // Generate new token:
  const token = auth.generateNewToken(customer);

  return token;
}

async function areEmailOrIDCustomerExist(
  customer: ICustomerModel
): Promise<boolean> {
  //Check if there is duplicate username:
  const usernameExists = await CustomerModel.findOne({
    username: customer.username,
  }).exec();

  if (usernameExists) return false;

  //Hash the ID Customer to compare:
  const hashedIdCustomer = hash(customer.IDCustomer);

  //Check if there is duplicate ID Customer:
  const IDCustomerExists = await CustomerModel.findOne({
    IDCustomer: hashedIdCustomer,
  }).exec();

  if (IDCustomerExists) return false;

  //if there are no duplicates:
  return true;
}

export default {
  register,
  login,
  areEmailOrIDCustomerExist,
};
