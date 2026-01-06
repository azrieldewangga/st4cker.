import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode | ((props: { error: Error; resetErrorBoundary: () => void }) => ReactNode);
    context?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public handleReload = () => {
        this.setState({ hasError: false, error: null });
        // If it's a hard crash, reload page is default, but for reset we just clear state
    };

    public render() {
        if (this.state.hasError && this.state.error) {
            // Priority 1: Custom Fallback (Function or Node)
            if (this.props.fallback) {
                if (typeof this.props.fallback === 'function') {
                    return this.props.fallback({
                        error: this.state.error,
                        resetErrorBoundary: this.handleReload
                    });
                }
                return this.props.fallback;
            }

            // Priority 2: Default UI (Global Crash Style)
            return (
                <div className="min-h-[400px] w-full flex items-center justify-center bg-background p-4">
                    <Card className="max-w-md w-full border-destructive/20 shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-xl">{this.props.context ? `${this.props.context} Error` : 'Something went wrong'}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                            <p className="text-muted-foreground text-sm">
                                The application encountered an unexpected error.
                            </p>
                            {/* Optional: Show error message in dev mode */}
                            {(import.meta.env.DEV || true) && this.state.error && (
                                <div className="mt-4 p-3 bg-muted rounded-md text-xs text-left font-mono overflow-auto max-h-32 border">
                                    {this.state.error.message}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button onClick={() => window.location.reload()} variant="default" className="w-full">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reload App
                            </Button>
                            <Button onClick={this.handleReload} variant="outline" className="w-full">
                                Try Again
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
