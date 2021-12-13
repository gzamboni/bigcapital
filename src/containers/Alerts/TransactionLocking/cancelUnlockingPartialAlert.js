import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import { useCancelUnlockingPartialTransactions } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Cancel Unlocking partial transactions alerts.
 */
function CancelUnlockingPartialTarnsactions({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { module },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: cancelUnlockingPartial, isLoading } =
    useCancelUnlockingPartialTransactions();

  // Handle cancel.
  const handleCancel = () => {
    closeAlert(name);
  };

  // Handle confirm.
  const handleConfirm = () => {
    const values = {
      module: module,
    };
    cancelUnlockingPartial(values)
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'unlocking_partial_transactions.alert.success_message',
          ),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {},
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'save'} />}
      icon="trash"
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'unlocking_partial_transactions.alert.message'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CancelUnlockingPartialTarnsactions);
