<div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
    <p class="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
        The following POIs exist in VR4More but not in Evalve:
    </p>
    <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-64 overflow-y-auto">
        @foreach ($pois as $poi)
            <li>{{ $poi['title'] ?? $poi['poiId'] ?? 'Unnamed POI' }}</li>
        @endforeach
    </ul>
    <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
        These will be imported into Evalve before pushing to ensure data consistency.
    </p>
</div>
