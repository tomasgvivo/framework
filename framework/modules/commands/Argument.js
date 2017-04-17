class CommandArgument {

	constructor(synopsis, description, validator, defaultValue, complete) {
		this.synopsis = synopsis;
		this.description = description;
		this.validator = validator;
		this.defaultValue = defaultValue;
		this.complete = complete || (() => {
			return Promise.resolve([]);
		});
	}

	static get INTEGER() {
		return 1 << 0;
	}
	static get FLOAT() {
		return 1 << 1;
	}
	static get BOOLEAN() {
		return 1 << 2;
	}
	static get STRING() {
		return 1 << 3;
	}
	static get LIST() {
		return 1 << 4;
	}
	static get REPEATABLE() {
		return 1 << 5;
	}
	static get REQUIRED() {
		return 1 << 6;
	}
}

module.exports = CommandArgument;