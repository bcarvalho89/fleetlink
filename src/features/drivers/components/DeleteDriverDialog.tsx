import { Button, Dialog, LoadingButton } from '@/components/ui';

interface DeleteDriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteDriverDialog = ({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}: DeleteDriverDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p>
        Are you sure you want to delete this driver? This action cannot be
        undone.
      </p>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="destructive"
          onClick={onDelete}
          loading={isDeleting}
        >
          Delete
        </LoadingButton>
      </div>
    </Dialog>
  );
};
