module.exports = {
    env: {
        browser: true,
        jest: true
    },
    extends: ['airbnb', 'plugin:prettier/recommended'],
    parser: 'babel-eslint',
    rules: {
        'class-methods-use-this': 0,
        'import/no-named-as-default': 0,
        'react/jsx-filename-extension': [
            'error',
            {
                extensions: ['.js', '.jsx']
            }
        ]
    }
};
