const EmptyListView = ({ icon, title, text, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">{title}</h4>
        <p className="text-slate-400 text-sm px-6">{text}</p>
      </div>
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="px-4 py-2 text-sm text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyListView;