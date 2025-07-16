<x-filament-panels::page.simple>
    <form wire:submit="register">
        {{ $this->form }}

        <x-filament::button type="submit">
            Submit
        </x-filament::button>
    </form>
</x-filament-panels::page.simple>
