import React, { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useDeletePrompt } from '~/data-provider';
import { Button, OGDialog, OGDialogTrigger, Label, OGDialogTemplate } from '@librechat/client';
import { useLocalize } from '~/hooks';

const DeleteConfirmDialog = ({
  name,
  disabled,
  selectHandler,
}: {
  name: string;
  disabled?: boolean;
  selectHandler: () => void;
}) => {
  const localize = useLocalize();

  return (
    <OGDialog>
      <OGDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          aria-label="Delete version"
          className="h-10 w-10 p-0.5"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Trash2 className="size-5 cursor-pointer text-white" />
        </Button>
      </OGDialogTrigger>
      <OGDialogTemplate
        showCloseButton={false}
        title={localize('com_ui_delete_prompt')}
        className="max-w-[450px]"
        main={
          <>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="grid w-full items-center gap-2">
                <Label
                  htmlFor="dialog-delete-confirm-prompt"
                  className="text-left text-sm font-medium"
                >
                  {localize('com_ui_delete_confirm_prompt_version_var', { 0: name })}
                </Label>
              </div>
            </div>
          </>
        }
        selection={{
          selectHandler,
          selectClasses:
            'bg-surface-destructive hover:bg-surface-destructive-hover transition-colors duration-200 text-white',
          selectText: localize('com_ui_delete'),
        }}
      />
    </OGDialog>
  );
};

interface DeletePromptProps {
  promptId?: string;
  groupId: string;
  promptName: string;
  disabled: boolean;
}

const DeletePrompt = React.memo(
  ({ promptId, groupId, promptName, disabled }: DeletePromptProps) => {
    const deletePromptMutation = useDeletePrompt();

    const handleDelete = useCallback(() => {
      if (!promptId) {
        console.warn('No prompt ID provided for deletion');
        return;
      }
      deletePromptMutation.mutate({
        _id: promptId,
        groupId,
      });
    }, [promptId, groupId, deletePromptMutation]);

    if (!promptId) {
      return null;
    }

    return (
      <DeleteConfirmDialog
        name={promptName}
        disabled={disabled || !promptId}
        selectHandler={handleDelete}
      />
    );
  },
);

DeletePrompt.displayName = 'DeletePrompt';

export default DeletePrompt;
