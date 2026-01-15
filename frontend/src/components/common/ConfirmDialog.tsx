type Props = {
  open: boolean; // should the dialog be visible?
  title: string; // message to show
  onYes: () => void; // user confirms
  onNo: () => void; // user cancels
};

export default function ConfirmDialog({ open, title, onYes, onNo }: Props) {
  // If not open, render nothing (component disappears)
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>

        <div className="modal-actions">
          <button onClick={onNo}>Cancel</button>
          <button onClick={onYes}>Yes</button>
        </div>
      </div>
    </div>
  );
}
