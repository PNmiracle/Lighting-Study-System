import { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React 错误边界
 * 捕获子组件渲染错误，显示错误回退 UI
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('React ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h6" color="error">
            页面渲染出错
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
            {this.state.error?.message || '发生了未知错误'}
          </Typography>
          <Button variant="contained" onClick={this.handleReset} sx={{ mt: 1 }}>
            重新加载
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
