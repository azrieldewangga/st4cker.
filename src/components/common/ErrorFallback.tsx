import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary?: () => void;
    context?: string;
}

export const ErrorFallback = ({ error, resetErrorBoundary, context }: ErrorFallbackProps) => {
    return (
        <Card className="max-w-2xl mx-auto mt-10 shadow-lg border-destructive/20">
            <CardHeader className="bg-destructive/5 rounded-t-lg">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle className="text-xl">{context ? `${context} Error` : 'Something Went Wrong'}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="bg-muted/50 p-4 rounded-md border text-sm font-mono break-all">
                    {error.message || "Unknown error occurred"}
                </div>
                <div className="flex gap-4">
                    {resetErrorBoundary && (
                        <Button onClick={resetErrorBoundary} variant="default">
                            Try Again
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Reload Application
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
