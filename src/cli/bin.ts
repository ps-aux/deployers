#!/usr/bin/env node

import entrypoint from 'src/cli/entrypoint'
import { createContext } from 'src/cli/Context'

// eslint-disable-next-line no-unused-expressions
entrypoint(createContext()).argv
