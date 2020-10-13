'use strict'

import { OperationError as _OperationError } from '@affinityproject/common-affinity-network'

const root = process.cwd()
const path = `${root}/config/errors.yaml`

const OperationError = _OperationError.buildOperationErrorClassSync(path)

export default OperationError
