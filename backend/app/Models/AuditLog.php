<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'model',
        'model_id',
        'description',
        'ip_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Create a new audit log entry.
     */
    public static function record(
        string $action,
        string $description,
        ?string $model = null,
        ?int $modelId = null,
        ?int $userId = null,
        ?string $ip = null
    ): self {
        return static::create([
            'user_id'     => $userId ?? auth()->id(),
            'action'      => $action,
            'model'       => $model,
            'model_id'    => $modelId,
            'description' => $description,
            'ip_address'  => $ip ?? request()->ip(),
        ]);
    }
}
