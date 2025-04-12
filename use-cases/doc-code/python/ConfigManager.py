class ConfigManager:
    def __init__(self, config_file=None, environment=None):
        self.config_data = {}
        self.environment = environment or "development"
        self.config_file = config_file
        self._secret_keys = set(["password", "secret", "key", "token"])

        # Load default configuration
        self._load_defaults()

        # Load from file if provided
        if config_file:
            self._load_from_file(config_file)

        # Override with environment variables
        self._load_environment_vars()

    def _load_defaults(self):
        """Load default configuration values"""
        self.config_data = {
            "development": {
                "debug": True,
                "log_level": "DEBUG",
                "database": {
                    "host": "localhost",
                    "port": 5432,
                    "user": "dev_user",
                    "password": "dev_password"
                }
            },
            "production": {
                "debug": False,
                "log_level": "ERROR",
                "database": {
                    "host": "db.example.com",
                    "port": 5432,
                    "user": "prod_user",
                    "password": "change_me"
                }
            },
            "test": {
                "debug": True,
                "log_level": "DEBUG",
                "database": {
                    "host": "localhost",
                    "port": 5432,
                    "user": "test_user",
                    "password": "test_password"
                }
            }
        }

    def _load_from_file(self, file_path):
        """Load configuration from file"""
        import json
        import yaml
        try:
            if file_path.endswith(".json"):
                with open(file_path, "r") as f:
                    file_config = json.load(f)
                    self._merge_config(file_config)
            elif file_path.endswith((".yaml", ".yml")):
                with open(file_path, "r") as f:
                    import yaml
                    file_config = yaml.safe_load(f)
                    self._merge_config(file_config)
            else:
                raise ValueError(f"Unsupported config file format: {file_path}")
        except Exception as e:
            print(f"Error loading config file: {e}")

    def _load_environment_vars(self):
        """Override configuration with environment variables"""
        import os
        prefix = "APP_"
        for key, value in os.environ.items():
            if key.startswith(prefix):
                # Convert APP_DATABASE_HOST to database.host
                config_path = key[len(prefix):].lower().replace("_", ".")
                self.set(config_path, value)

    def _merge_config(self, new_config):
        """Merge new configuration with existing configuration"""
        if self.environment in new_config:
            env_config = new_config[self.environment]
            self._deep_merge(self.config_data[self.environment], env_config)

        if "all" in new_config:
            all_config = new_config["all"]
            self._deep_merge(self.config_data[self.environment], all_config)

    def _deep_merge(self, target, source):
        """Recursively merge nested dictionaries"""
        for key, value in source.items():
            if key in target and isinstance(target[key], dict) and isinstance(value, dict):
                self._deep_merge(target[key], value)
            else:
                target[key] = value

    def get(self, path, default=None):
        """Get configuration value by path"""
        keys = path.split(".")
        config = self.config_data[self.environment]

        for key in keys:
            if isinstance(config, dict) and key in config:
                config = config[key]
            else:
                return default

        return config

    def set(self, path, value):
        """Set configuration value by path"""
        keys = path.split(".")
        config = self.config_data[self.environment]

        # Navigate to the nested dict that contains the value
        for i, key in enumerate(keys[:-1]):
            if key not in config or not isinstance(config[key], dict):
                config[key] = {}
            config = config[key]

        # Set the value
        config[keys[-1]] = value

    def as_dict(self):
        """Return the configuration for the current environment as a dictionary"""
        return self.config_data[self.environment].copy()

    def is_debug_mode(self):
        """Shortcut to check if debug mode is enabled"""
        return self.get("debug", False)

    def get_masked(self):
        """Return configuration with sensitive values masked"""
        import copy
        masked_config = copy.deepcopy(self.config_data[self.environment])
        self._mask_secrets(masked_config)
        return masked_config

    def _mask_secrets(self, config, mask="********"):
        """Recursively mask secret values in the configuration"""
        if isinstance(config, dict):
            for key, value in config.items():
                # Check if this is a secret key
                if any(secret in key.lower() for secret in self._secret_keys) and isinstance(value, (str, int)):
                    config[key] = mask
                elif isinstance(value, (dict, list)):
                    self._mask_secrets(value, mask)
        elif isinstance(config, list):
            for i, item in enumerate(config):
                if isinstance(item, (dict, list)):
                    self._mask_secrets(item, mask)