import { RuleConfigSeverity } from '@commitlint/types';

export default {
    extends: ["@commitlint/config-conventional"],
    rules: {
        'type-enum': [
            RuleConfigSeverity.Error,
            'always',
            [
				"build",
				"ci",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"style",
				"test",
			],
        ]
    }
};
