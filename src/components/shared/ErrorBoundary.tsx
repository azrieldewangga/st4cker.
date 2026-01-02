import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Update state with error info
        this.setState({
            error,
            errorInfo,
        });

        // TODO: Log to error reporting service in production
        // e.g., Sentry, LogRocket, etc.
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen flex items-center justify-center p-8 bg-background">
                    <Card className="max-w-2xl w-full">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                                <CardTitle>Something went wrong</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. This might be a temporary issue.
                            </p>
                            {this.state.error && (
                                <div className="bg-muted p-4 rounded-md">
                                    <p className="text-sm font-mono text-destructive">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button onClick={this.handleReload} variant="default">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reload App
                            </Button>
                            <Button onClick={this.handleReset} variant="outline">
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
