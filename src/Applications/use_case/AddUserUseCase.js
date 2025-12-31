const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);

    const encryptedPassword = await this._passwordHash.hash(registerUser.password);

    return this._userRepository.addUser({
      username: registerUser.username,
      password: encryptedPassword,
      fullname: registerUser.fullname,
    });
  }
}

module.exports = AddUserUseCase;
