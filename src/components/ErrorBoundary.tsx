import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg p-8 font-sans">
          <h1 className="mb-2 text-xl font-semibold text-slate-900">Ошибка загрузки</h1>
          <p className="text-red-700">{this.state.message}</p>
          <p className="mt-4 text-sm text-slate-600">
            Обновите страницу (Ctrl+F5). Если не помогло — проверьте деплой через GitHub
            Actions.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
