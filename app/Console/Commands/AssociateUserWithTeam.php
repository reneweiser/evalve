<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Models\User;
use Illuminate\Console\Command;

class AssociateUserWithTeam extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:associate-user-with-team';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->choice('User email', User::pluck("email")->toArray());
        $teamId = $this->choice("Provide team id", Team::pluck('id')->toArray());

        $user = User::query()->where("email", $email)->first();

        if (!$user) {
            $this->error("User not found");
        }

        $team = Team::query()->where("id", $teamId)->first();

        if (!$team) {
            $this->error("Team not found");
        }

        $user->teams()->attach($teamId);

        $this->info("User associated with team $teamId ($team->name)");
    }
}
