<?php

namespace App\Console\Commands;

use App\Models\SceneObject;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ImportPois extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-pois';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    private static function makeProperties($poi)
    {
        $poses = [];

        foreach ($poi['poses'] as $pose) {
            $poses[] = [
                'data' => [
                    'id' => $pose['id'],
                    'role' => $pose['role'],
                    'position' => $pose['position'],
                    'rotation' => $pose['rotation'],
                ],
                'type' => 'pose',
            ];
        }

        return $poses;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fileName = $this->ask('Provide the filename. File must be in storage/app/private.', 'pois.json');
        $teamId = $this->ask('Provide a team_id');

        $contents = Storage::disk('local')->get('tmp/'.$fileName);

        $pois = collect(json_decode($contents, true)['pois']);

        $poisFormatted = $pois->map(fn ($poi) => [
            'name' => $poi['title'],
            'team_id' => $teamId,
            'transform' => [
                'position' => $poi['position'],
                'rotation' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
            ],
            'properties' => self::makeProperties($poi),
        ]);

        foreach ($poisFormatted as $poi) {
            SceneObject::updateOrCreate(
                ['name' => $poi['name']],
                $poi
            );
        }
    }
}
