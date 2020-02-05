#!/usr/bin/env node

import entrypoint from 'src/cli/entrypoint'
import { createExecutionContext } from 'src/cli/ExecutionContext'

// eslint-disable-next-line no-unused-expressions
entrypoint(createExecutionContext()).argv
